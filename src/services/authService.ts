import { Alert } from 'react-native';
import { auth } from "./firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

const msgAviso = {titulo: 'Atenção!', mensagem: 'Preencha o email e senha', recSenha: 'Por favor, digite seu email'};
const msgSucess= {titulo: 'Sucesso!', mensagem: 'Conta Criada!', email: 'Link para recuperação de senha enviado'};

export async function Login(email: string, senha: string) {
        if(!email || !senha){
            Alert.alert(msgAviso.titulo, msgAviso.mensagem);
            return false;
        }
        signInWithEmailAndPassword(auth, email, senha).then(() =>{
            return true;
        }).catch((erro) =>{
            Alert.alert(
                'Erro', erro.message
            )
            return false;
        });
}

export async function Cadastrar(email: string, senha: string){
        if(!email || !senha){
            Alert.alert(msgAviso.titulo, msgAviso.mensagem);
            return;
        }
        createUserWithEmailAndPassword(auth, email, senha).then(() =>{
            Alert.alert(msgSucess.titulo, msgSucess.mensagem);
            return;
        }).catch((erro) =>{
            Alert.alert('Erro:', erro.message);
        });
}

export async function Recover(email: string){
        if(email === ''){
            Alert.alert(msgAviso.titulo, msgAviso.recSenha)
            return;
        };
        sendPasswordResetEmail(auth, email).then(() =>{
            Alert.alert(msgSucess.titulo, msgSucess.email);
            console.log(msgSucess.titulo, msgSucess.email);
            return;
        }).catch((erro) =>{
            console.log("WEB: ERRO:" +erro.message);
            Alert.alert("Erro:", erro.message);
        });
}