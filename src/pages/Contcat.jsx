import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contcat = () => {
  const formRef = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_yo34veg",
        "template_zhnsmkh",
        formRef.current,
        "IGCLiTemdvjUEWCk4"
      )
      .then(
        () => {
          toast.success("Message sent successfully!");
          formRef.current.reset();
        },
        (error) => {
          console.error("Error:", error.text);
          toast.error("Failed to send message!");
        }
      );
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contcat Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text__para">
          Get a technical issue ? want to sand feedback about a beta feature ?
          let us Know
        </p>
        <form ref={formRef} onSubmit={sendEmail} className=" space-y-8">
          <div>
            <fieldset className="fieldset ">
              <legend className="fieldset-legend">your Email</legend>
              <input
                type="email"
                name="user_email"
                id="email"
                className="input w-full"
                placeholder="example@gmail.com"
                required
              />
            </fieldset>

            <fieldset className="fieldset ">
              <legend className="fieldset-legend">Subject</legend>
              <input
                type="text"
                name="subject"
                id="subject"
                className="input w-full"
                placeholder="Let us know how we can be help you"
                required
              />
            </fieldset>

            <fieldset className="fieldset">
              <legend className="fieldset-legend">message</legend>
              <textarea
                name="message"
                id="message"
                className="textarea h-24"
                placeholder="Let a comment..."
                required
              ></textarea>
            </fieldset>
          </div>
          <button
            type="submit"
            className="btn btn-info text-white bg-primaryColor"
          >
            Submit
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </section>
  );
};

export default Contcat;
