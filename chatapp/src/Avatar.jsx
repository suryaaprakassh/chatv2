import { CiUser } from "react-icons/ci";
const Avatar = () => {
  let classes =
    "w-10 h-10 rounded-full flex justify-center items-center text-black font-bolder bg-blue-200";
  return (
    <div className={classes}>
      <CiUser />
    </div>
  );
};

export default Avatar;
