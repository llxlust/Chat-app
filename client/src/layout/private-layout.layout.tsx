import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import classes from "./private-layout.module.scss";
import UseLogin from "../pages/login/hooks/useLogin";
import { IResponse } from "../types/response";
import { SessionContext } from "../stores/session.context";
import { IUser } from "../types/user";
export default function PrivateLayout() {
  const { isLoggedIn, setIsLoggedIn, setUser,user } = useContext(SessionContext);
  const { LoginByToken, Logout } = UseLogin();
  const navigate = useNavigate();
  const LogoutHandler = async () => {
    const data = await Logout();
    if (!data.success) {
      return;
    }
    navigate("/");
  };
  const CredentialVerify = async () => {
    const verify = (await LoginByToken()) as IResponse<IUser>;
    if (!verify.success) {
      navigate("/");
      return;
    }
    const user = verify.data;
    setUser(user);
    setIsLoggedIn(true);
  };
  useEffect(() => {
    if (!isLoggedIn) {
      CredentialVerify();
    }
  }, []);
  return (
    <>
      {isLoggedIn ? (
        <>
          <div className={classes.nav}>
            <div>
              <span style={{ color: "#8A05FF" }}>Chat</span>-app
            </div>
            <div className={classes.left}>
              <img className={classes.pi} src={`./public/${user?.profile}`}/>
              <div className={classes.username}>{user?.username}</div>
              <div onClick={LogoutHandler}>Logout</div>
            </div>
          </div>
          <Outlet />
        </>
      ) : (
        <>
          <h1>Loading . . . </h1>
        </>
      )}
    </>
  );
}
