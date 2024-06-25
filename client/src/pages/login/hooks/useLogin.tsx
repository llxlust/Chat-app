import axios, { AxiosError } from "axios"

export default function UseLogin(){
    const LoginByUserAndPass = async (username:string,password:string) => {
        const payload = {username,password}
        try{
            const data = await axios.post("http://localhost:3100/api/v1/auth/login",payload,{withCredentials:true})
            return data.data
        }catch(error){
            const err = error as AxiosError
            return err.response?.data
        }
    }
    const Register = async (username:string,password:string,profile:string) => {
        const payload = {username,password,profile}
        try{
            const data = await axios.post("http://localhost:3100/api/v1/auth/register",payload,{withCredentials:true})
            return data.data
        }catch(error){
            const err = error as AxiosError
            return err.response?.data
        }
    }
    const LoginByToken = async () => {
        try{
            const data = await axios.post("http://localhost:3100/api/v1/auth/loginByToken",{},{withCredentials:true})
            return data.data
        }catch(error){
            const err = error as AxiosError
            return err.response?.data
        }
    }
    const Logout = async () => {
        try{
            const data = await axios.delete("http://localhost:3100/api/v1/auth/logout",{withCredentials:true})
            return data.data
        }catch(error){
            const err = error as AxiosError
            return err.response?.data
        }
    }
    return {LoginByUserAndPass,LoginByToken,Logout,Register}
}
