import classes from "./profiles-selector.module.scss";
interface IProfilesSelectorProps {
  setSelectPicture: (name: string) => void;
  selectPicture: string;
  onRegisterHandler: ()=>void
}
export default function ProfileSelector({
  onRegisterHandler,
  selectPicture,
  setSelectPicture,
}: IProfilesSelectorProps) {
  const profile = [
    {
      name: "cat-profile.jpg",
      path: "./public/cat-profile.jpg",
    },
    {
      name: "lion-profile.jpg",
      path: "./public/lion-profile.jpg",
    },
    {
      name: "monkey-profile.jpg",
      path: "./public/monkey-profile.jpg",
    },
    {
      name: "polar-profile.jpg",
      path: "./public/polar-profile.jpg",
    },
    {
      name: "shipmunk-profile.jpg",
      path: "./public/shipmunk-profile.jpg",
    },
    {
      name: "tiger-profile.jpg",
      path: "./public/tiger-profile.jpg",
    },
  ];
  return (
    <>
      <div className={classes.container}>
        <div className={classes.card}>
          <div>Select your profile image</div>
          <div className={classes.profilePool}>
            {profile.map((value: { name: string; path: string }) => {
              return (
                <>
                  <img
                  onClick={()=>setSelectPicture(value.name)}
                    className={
                      classes[
                        `${
                          selectPicture === value.name
                            ? "pictureActive"
                            : "picture"
                        }`
                      ]
                    }
                    alt={value.name}
                    src={value.path}
                  />
                </>
              );
            })}
          </div>
          <div className={classes.controller}>
            <div onClick={()=>onRegisterHandler()}>Go!</div>
          </div>
        </div>
      </div>
    </>
  );
}
