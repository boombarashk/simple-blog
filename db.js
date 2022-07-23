const { initializeApp } =  require('firebase/app')
const { getFirestore, collection, getDocs, addDoc, doc, deleteDoc, updateDoc } = require('firebase/firestore/lite')

const config = require('./config')

const fbApp = initializeApp(config.firebaseConfig)
const firestore = getFirestore(fbApp);

async function getData(name, id = null) {
    const col = collection(firestore, name);
    const snapshot = await getDocs(col);
    const items = snapshot.docs.map(item => {return {id: item.id, ...item.data()}})

    if (!id) {
        return items;
    } else {
        return items.filter(item => item.id === id)?.[0];
    }
}

async function setData(name, data) {
    const col = collection(firestore, name);
    const docInstance = {...data}

    if (name !== 'users') {
        docInstance.created_at = new Date().getTime()
    }

    const docRef = await addDoc(col, docInstance)
    return {...docInstance, id: docRef.id}

}

async function deleteData(name, id) {
    const docRef = doc(firestore, name, id)
    await deleteDoc(docRef);
}

async function updateData(name, id, data) {
    const docRef = doc(firestore, name, id)
    await updateDoc(docRef, {...data});
}

module.exports = {
    getData,
    setData,
    deleteData,
    updateData,
    getDocs,
}
