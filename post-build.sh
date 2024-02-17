#If the folder exists, remove it first, then copy the files
if [ -d "./../server/output/*" ]; then

    rm -rv ./../server/output/*
    mv -v build/* ./../server/output/

#Else make a new folder and then move the files.
else
    mkdir -p ./../server/output
    mv -v build/* ./../server/output/
fi