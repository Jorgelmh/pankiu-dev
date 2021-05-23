import React, { useState } from "react";

import { Form, Field, FormElement } from "@progress/kendo-react-form";
import { Error } from "@progress/kendo-react-labels";
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
const SignUpForm = () => {
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

    <Form
      onSubmit={handleSubmit}
      render={(formRenderProps) => (
        <FormElement style={{display:'flex', justifyContent:'center', width:'30%',flexDirection:'column', margin:'6rem 0px 3rem 0px'}}>
          <fieldset className={"k-form-fieldset"}>
            <legend className={"k-form-legend"}>
              Please fill in the fields:
            </legend>
            <div className="mb-3">
              <Field
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                name={"username"}
                component={Input}
                label={"User name"}
                required={true}
                minLength={5}
              />
            </div>

            <div className="mb-3">
              <Field
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                name={"email"}
                type={"email"}
                component={EmailInput}
                label={"Email"}
                validator={emailValidator}
              />
            </div>

            <div className="mb-3">
              <Field
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValues({ ...values, [e.target.name]: e.target.value })
                }
                name={"password"}
                component={Input}
                label={"Password"}
                minLength={8}
                required={true}
              />
            </div>
          </fieldset>
          <div className="k-form-buttons" style={{display:'flex', justifyContent:'center', margin:'4rem auto 0px auto'}}>
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
  );
};

export default SignUpForm;
