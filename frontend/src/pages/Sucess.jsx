import { assets } from "../assets/assets";

function Sucess() {
  return (
    <div className="flex h-[70vh] max-h-screen px-[5%] items-center justify-center">
      <div className="flex flex-col items-center  ">
        <img src={assets.Sucess} alt="" />
        <h2 className="text-[32px] font-bold md:text-36 mb-6 max-w-[600px] text-center">
          Your <span className="text-primary">appointment request</span> has
          been sucessfully submitted!
        </h2>
        <p>We will be in touch shortly to confirm.</p>
      </div>
    </div>
  );
}

export default Sucess;
