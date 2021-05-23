import React, { useState } from "react";
import { StyledContainer } from './styles'

import Botsignup from "components/organisms/signup2/2";
import SignupText from "components/organisms/signup2/3";



import { Form, Field, FormElement } from "@progress/kendo-react-form";

import { Error, Label } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";

const emailRegex = new RegExp(/\S+@\S+\.\S+/);
const emailValidator = (value: any) =>
  emailRegex.test(value) ? "" : "Please enter a valid email.";
const EmailInput = (fieldRenderProps: any) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};
const LoginForm = () => {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    // To Do Asign Loader or disable button

    const options: RequestInit = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(values), // body data type must match "Content-Type" header
    };

    const response = await fetch("/sessions/register", options);
    const data = await response.json();

    if (data.ok) {
      console.log(data.token);
      localStorage.setItem("token", data.token);
    } else {
      alert(data.message);
    }
  };
  return (
    
  <StyledContainer>
    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement >
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>
            Login
            </legend>
            <div className="mb-3">
              <Label editorId='username'>
                User name
              </Label>
              <Field
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                id='username'
                name={"username"}
                component={Input}
           
                required={true}
                minLength={5}
              />
            </div>

            

            <div className="mb-3">
              <Label editorId='password'>
                Password
              </Label>
              <Field
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                name={"password"}
                component={Input}
                id='password'
                minLength={8}
                required={true}
              />
            </div>
          </fieldset>
          <div className="k-form-buttons" >
            <button
              type={"submit"}
              className="k-button"
              disabled={!formRenderProps.allowSubmit}
            >
              Submit
            </button>
          </div>
          
        </FormElement>
      )}
    />
  </StyledContainer>

  );
};

export default LoginForm;
