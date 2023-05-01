import { CiUser } from "react-icons/ci";
const Avatar = () => {
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-teal-200",
    "bg-yellow-200",
    "bg-orange-200",
  ];
  const i = Math.floor(Math.random() * (colors.length - 1));
  let classes =
    "w-10 h-10 rounded-full flex justify-center items-center text-black font-bolder ";
  classes += colors[i];
  return (
    <div className={classes}>
      <CiUser />
    </div>
  );
};

export default Avatar;
