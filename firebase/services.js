import { collection, addDoc } from "firebase/firestore";

import { db } from './connect';

export const registrarUsuario = async (uid, nombre, correo) => {
    try{
        await addDoc(collection(db, "usuarios"),{
            uid_usuario: uid,
            fecha_creacion: new Date(),
            nombre: nombre,
            correo: correo,
        });
    } catch (error){
        return error;
    }
};