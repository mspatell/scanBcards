import React, { useState } from "react";
import "../styles/infoCard.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const serverUrl = "http://127.0.0.1:8000";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function InfoCard(props) {
  const [open, setOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = () => {
    console.log("Submitting card details: ", props.cardDetails);

    const payload = {
      card_id: props.cardDetails.card_id || "some-unique-id",
      user_id: localStorage.getItem("user_sub") || "",
      user_names: props.cardDetails.name ? [props.cardDetails.name] : [""],
      telephone_numbers: props.cardDetails.phone
        ? [props.cardDetails.phone]
        : [""],
      email_addresses: props.cardDetails.email
        ? [props.cardDetails.email]
        : [""],
      company_name: props.cardDetails.name || "",
      company_website: props.cardDetails.website || "",
      company_address: props.cardDetails.address || "",
      image_storage: props.cardDetails.image_url || "",
    };

    fetch(serverUrl + "/cards", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        console.log("Raw response:", response); // Log the response object
        if (!response.ok) {
          throw new Error(
            "Network response was not ok: " + response.statusText
          );
        }
        return response.text(); // Get the response as text
      })
      .then((text) => {
        console.log("Raw response text:", text); // Log the raw text response
        // Check if response looks like JSON
        if (text.trim().startsWith("{") || text.trim().startsWith("[")) {
          try {
            const jsonResponse = JSON.parse(text); // Attempt to parse the text as JSON
            console.log("Parsed JSON:", jsonResponse);
            setModalMessage("Card Details saved successfully!!!");
          } catch (error) {
            console.error("Error parsing JSON:", error.message);
            setModalMessage("Received invalid JSON response from server.");
          }
        } else {
          // Handle non-JSON responses
          console.log("Received non-JSON response:", text);
          setModalMessage("Card Details saved successfully with ID: " + text);
        }
        setOpen(true);
      })
      .catch((error) => {
        console.error("Error during submission:", error.message);
        setModalMessage("Failed to save card details. Please try again.");
        setOpen(true);
      });
  };

  return (
    <div>
      <div className="form">
        <div className="title">Business Card Details</div>

        <div className="input-container ic1">
          <input
            id="name"
            className="input"
            type="text"
            placeholder=" "
            onChange={(event) => props.handleChangeInput(event, "name")}
            value={props.cardDetails.name || ""}
          />
          <label htmlFor="name" className="placeholder">
            Name
          </label>
        </div>

        <div className="input-container ic2">
          <input
            id="phone"
            className="input"
            type="text"
            placeholder=" "
            onChange={(event) => props.handleChangeInput(event, "phone")}
            value={props.cardDetails.phone || ""}
          />
          <label htmlFor="phone" className="placeholder">
            Phone
          </label>
        </div>

        <div className="input-container ic2">
          <input
            id="email"
            className="input"
            type="text"
            placeholder=" "
            onChange={(event) => props.handleChangeInput(event, "email")}
            value={props.cardDetails.email || ""}
          />
          <label htmlFor="email" className="placeholder">
            Email
          </label>
        </div>

        <div className="input-container ic2">
          <input
            id="website"
            className="input"
            type="text"
            placeholder=" "
            onChange={(event) => props.handleChangeInput(event, "website")}
            value={props.cardDetails.website || ""}
          />
          <label htmlFor="website" className="placeholder">
            Website
          </label>
        </div>

        <div className="input-container ic2">
          <input
            id="address"
            className="input"
            type="text"
            placeholder=" "
            onChange={(event) => props.handleChangeInput(event, "address")}
            value={props.cardDetails.address || ""}
          />
          <label htmlFor="address" className="placeholder">
            Address
          </label>
        </div>

        <button type="text" className="submit" onClick={onSubmit}>
          Submit
        </button>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalMessage.includes("success") ? "Success" : "Error"}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalMessage}
          </Typography>
        </Box>
      </Modal>

      <div style={{ height: "40px" }}></div>
    </div>
  );
}

export default InfoCard;
