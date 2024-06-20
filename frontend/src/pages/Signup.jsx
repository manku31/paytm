import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";
import { BottomWarning } from "../components/BottomWarning";

export function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const newUser = async () => {
    const response = await axios.post(
      "https://paytm-hucr.onrender.com/api/v1/user/signup",
      {
        username,
        firstName,
        lastName,
        password,
      }
    );
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign Up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox
            onchange={(e) => setFirstName(e.target.value)}
            label={"First Name"}
            placeholder="John"
          />
          <InputBox
            onchange={(e) => setLastName(e.target.value)}
            label={"Last Name"}
            placeholder="Doe"
          />
          <InputBox
            onchange={(e) => setUsername(e.target.value)}
            label={"Email"}
            placeholder="abc@xyz.com"
          />
          <InputBox
            onchange={(e) => setPassword(e.target.value)}
            label={"Password"}
            placeholder="123456"
          />
          <div className="pt-4">
            <Button label={"Sign Up"} onClick={newUser} />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
}
