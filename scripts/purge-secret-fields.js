/**
 * Removes leaked credential fields from Firestore documents.
 *
 * Background: 8 of 10 `projects` documents carried an `authToken` field. The
 * front office reads that collection unauthenticated and spreads the whole
 * document (`{ _id: doc.id, ...doc.data() }`), so every field reached every
 * visitor's browser. No current code writes it — it is stale data from an older
 * version of the back-office form.
 *
 * Usage:
 *   node scripts/purge-secret-fields.js            # dry run, changes nothing
 *   node scripts/purge-secret-fields.js --apply    # actually deletes the fields
 *
 * Credentials, same as scripts/generate-sitemap.js:
 *   set GOOGLE_APPLICATION_CREDENTIALS, or place serviceAccountKey.json in the
 *   repo root (gitignored).
 *
 * Values are never printed. Only field names, collection names and document ids.
 */

const fs = require('fs');
const path = require('path');
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

const APPLY = process.argv.includes('--apply');

// Fields deleted outright. Add to this list if more leak in future.
const PURGE = ['authToken'];

// Reported but NOT deleted — flagged so a human can judge.
const SUSPICIOUS = /token|secret|password|apikey|api_key|credential|private[-_]?key/i;

function init() {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({ credential: applicationDefault() });
    return;
  }
  const local = path.join(__dirname, '..', 'serviceAccountKey.json');
  if (fs.existsSync(local)) {
    initializeApp({ credential: cert(require(local)) });
    return;
  }
  console.error('No credentials. Set GOOGLE_APPLICATION_CREDENTIALS or add serviceAccountKey.json to the repo root.');
  process.exit(1);
}

init();
const db = getFirestore();

(async () => {
  const collections = await db.listCollections();
  console.log(`Scanning ${collections.length} collections${APPLY ? '' : '  (DRY RUN — nothing will change)'}\n`);

  let toPurge = [];
  const flagged = new Map();

  for (const col of collections) {
    const snap = await col.get();
    for (const doc of snap.docs) {
      const data = doc.data();
      const hits = PURGE.filter((f) => Object.prototype.hasOwnProperty.call(data, f));
      if (hits.length) toPurge.push({ col: col.id, id: doc.id, fields: hits });

      for (const k of Object.keys(data)) {
        if (SUSPICIOUS.test(k) && !PURGE.includes(k)) {
          const key = `${col.id}.${k}`;
          flagged.set(key, (flagged.get(key) || 0) + 1);
        }
      }
    }
    console.log(`  ${col.id.padEnd(18)} ${snap.size} docs`);
  }

  console.log(`\nDocuments carrying a field marked for removal: ${toPurge.length}`);
  for (const t of toPurge) console.log(`  ${t.col}/${t.id}  ->  ${t.fields.join(', ')}`);

  if (flagged.size) {
    console.log(`\nOther fields whose NAME looks credential-ish (not touched — review by hand):`);
    for (const [k, n] of flagged) console.log(`  ${k}  (${n} docs)`);
  }

  if (!toPurge.length) {
    console.log('\nNothing to remove.');
    process.exit(0);
  }

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to delete these fields.');
    process.exit(0);
  }

  // Batched so a partial failure cannot leave a half-finished pass ambiguous.
  let batch = db.batch();
  let n = 0;
  for (const t of toPurge) {
    const patch = {};
    for (const f of t.fields) patch[f] = FieldValue.delete();
    batch.update(db.collection(t.col).doc(t.id), patch);
    if (++n % 400 === 0) { await batch.commit(); batch = db.batch(); }
  }
  await batch.commit();
  console.log(`\nRemoved fields from ${toPurge.length} documents.`);

  // Prove it, rather than assume the write succeeded.
  let remaining = 0;
  for (const t of toPurge) {
    const fresh = await db.collection(t.col).doc(t.id).get();
    if (t.fields.some((f) => Object.prototype.hasOwnProperty.call(fresh.data() || {}, f))) remaining++;
  }
  console.log(remaining === 0
    ? 'Verified: none of the removed fields remain.'
    : `WARNING: ${remaining} documents still carry the field.`);
  process.exit(remaining === 0 ? 0 : 1);
})().catch((e) => { console.error(e.message); process.exit(1); });
