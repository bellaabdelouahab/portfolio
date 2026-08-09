import { useEffect, useState } from "react";
import Modal from "../../../../shared/ui/Modal";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../../shared/lib/firebase";

export default function HappyClientsSection() {
    const [clients, setClients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "clients"));
                const clientsData = querySnapshot.docs.map(doc => doc.data());
                setClients(clientsData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchClients();
    }, []);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
      <div className="happy-clients-section hidden-area bg-[#0A0A0A] bg-[linear-gradient(to_bottom,#171717,transparent_30px)] pt-7.5 pb-1.25 text-ink">
        <div className="home-sections-title">
          <span>06. </span>
          What My Clients Say
        </div>
        {/* `clients` is [] until the Firestore read lands, so on first paint this
            is just the centred CTA — the flex/gap/justify below is what keeps
            that empty state looking deliberate rather than broken. */}
        <div className="flex flex-wrap justify-center gap-5">
          {clients?.map((client, index) => (
            <div
              className="relative flex w-75 flex-col rounded-md bg-page p-5 shadow-md transition-transform duration-300 ease-standard hover:scale-110"
              key={index}
            >
              <img
                className="size-12.5 rounded-full"
                src={`${client.image}`}
                alt="client"
              />
              <img
                className="absolute top-2.5 right-2.5 size-5 border-none opacity-80"
                src="./icons/quotes.png"
                alt="quotes"
              />
              <h3 className="mt-2.5 text-base leading-snug text-ink">
                {client.name}
              </h3>
              {/* flex-1 so the quote absorbs the slack and the profession row
                  sits flush at the bottom of every card, whatever its length. */}
              <p className="flex-1 text-xs leading-snug text-ink">
                {client.description}
              </p>
              <div className="mt-2.5 flex w-full items-center justify-between">
                <p className="rounded-sm bg-surface px-1.5 py-0.75 text-xs leading-snug font-bold text-ink">
                  {client.profession}
                </p>
                <p className="rounded-sm bg-[#191919] px-1.5 py-0.75 text-xs leading-snug text-ink">
                  {client.company}
                </p>
              </div>
            </div>
          ))}
          <div className="my-2.5 flex w-full justify-center">
            <button
              className="cursor-pointer rounded-sm border-none bg-accent px-6 py-3 font-sans text-base font-bold tracking-[2px]! text-ink-strong shadow-[0_4px_10px_rgba(217,27,66,0.3)] transition-all duration-300 ease-standard hover:-translate-y-0.5 hover:bg-accent-hover hover:shadow-[0_6px_12px_rgba(217,27,66,0.4)] active:translate-y-px"
              onClick={toggleModal}
            >
              Share Your Experience
            </button>
          </div>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={toggleModal}
          title="Share Your Experience"
        >
          {/* Replace this URL with your actual Google Form URL */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSff6tzcnt1lN26FklbTZtNm2DvUFy5iAS9Pggxz0U8dN83VsA/viewform?embedded=true"
            title="Client Testimonial Form"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
          >
            Loading form...
          </iframe>
        </Modal>
      </div>
    );
}