import { useContext, useEffect, useState } from "react";
import CustomInput from "./components/custom-input/custom-input";
import classes from "./login.module.scss";
import UseLogin from "./hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { SessionContext } from "../../stores/session.context";
import { IResponse } from "../../types/response";
import { IUser } from "../../types/user";
import ProfileSelector from "./components/profiles-selector/profiles-selector";
export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [card, setCard] = useState<string>("login");
  const [regUsername, setRegUsername] = useState<string>("");
  const [regPassword, setRegPassword] = useState<string>("");
  const [regRePassword, setReRegPassword] = useState<string>("");
  const [isSelectProfile, setIsSelectProfile] = useState<boolean>(false);
  const [selectPicture, setSelectPicture] = useState<string>("cat-profile.jpg");
  const { setUser, setIsLoggedIn } = useContext(SessionContext);
  const { LoginByUserAndPass, LoginByToken, Register } = UseLogin();
  const navigate = useNavigate();
  const VerifyToken = async () => {
    const verify = await LoginByToken();
    if (!verify.success) {
      return;
    }
    setIsLoggedIn(true);
    setUser(verify.data);
    navigate("/homepage");
  };
  useEffect(() => {
    VerifyToken();
  }, []);

  const onSubmitHandler = async () => {
    if (username === "" && password === "") {
      alert("Plase provide username and password");
      return;
    }
    const loginData = (await LoginByUserAndPass(
      username,
      password
    )) as IResponse<IUser>;
    if (!loginData.success) {
      alert(loginData.data);
      return;
    }
    console.log(loginData.data, ":user");
    setUser(loginData.data);
    setIsLoggedIn(true);
    navigate("/homepage");
  };

  const onCheckData = async () => {
    if ((regUsername || regPassword || regRePassword) === "") {
      alert("Please provide user details");
      return;
    }
    if (regPassword !== regRePassword) {
      console.log(regPassword, regRePassword);
      alert("Please enter match password");
      return;
    }
    setIsSelectProfile(true);
  };

  const onRegisterHandler = async () => {
    const registerData = (await Register(
      regUsername,
      regPassword,
      selectPicture
    )) as IResponse<IUser>;
    if (!registerData.success) {
      alert(registerData.data);
      return;
    }
    location.reload();
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.nav}>
          <div>
            <span style={{ color: "#8A05FF" }}>Chat</span>-app
          </div>
          <div className={classes.action}>
            <div onClick={() => setCard("login")}>Login</div>
            <div onClick={() => setCard("register")}>Register</div>
          </div>
        </div>
        <div className={classes.cardContainer}>
          <div className={classes.card}>
            {card === "login" ? (
              <>
                <h1>Login</h1>
              </>
            ) : (
              <>
                <h1>Register</h1>
              </>
            )}
            <div className={classes.inputBar}>
              {card === "login" ? (
                <>
                  <CustomInput
                    label="username"
                    type="text"
                    onChangeInput={(msg) => setUsername(msg)}
                  />
                  <CustomInput
                    label="password"
                    type="password"
                    onChangeInput={(msg) => setPassword(msg)}
                  />
                </>
              ) : (
                <>
                  <CustomInput
                    label="username"
                    type="text"
                    onChangeInput={(msg) => setRegUsername(msg)}
                  />
                  <CustomInput
                    label="password"
                    type="password"
                    onChangeInput={(msg) => setRegPassword(msg)}
                  />
                  <CustomInput
                    label="re-password"
                    type="password"
                    onChangeInput={(msg) => setReRegPassword(msg)}
                  />
                </>
              )}
              <div className={classes.controller}>
                {card === "login" ? (
                  <>
                    <div
                      id="login"
                      className={classes.submit}
                      onClick={onSubmitHandler}
                    >
                      Login
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      id="register"
                      className={classes.submit}
                      onClick={onCheckData}
                    >
                      Register
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {isSelectProfile && (
          <ProfileSelector
          onRegisterHandler={()=>onRegisterHandler()}
            setSelectPicture={(name) => setSelectPicture(name)}
            selectPicture={selectPicture}
          />
        )}
      </div>
    </>
  );
}
