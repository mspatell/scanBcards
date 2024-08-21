import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from "react-crud-table";

import "../styles/list.css";

const serverUrl = "http://127.0.0.1:8000";

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

const SORTERS = {
  NUMBER_ASCENDING: (mapper) => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: (mapper) => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: (mapper) => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: (mapper) => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
  const mapper = (x) => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

  if (data.field === "id") {
    sorter =
      data.direction === "ascending"
        ? SORTERS.NUMBER_ASCENDING(mapper)
        : SORTERS.NUMBER_DESCENDING(mapper);
  } else {
    sorter =
      data.direction === "ascending"
        ? SORTERS.STRING_ASCENDING(mapper)
        : SORTERS.STRING_DESCENDING(mapper);
  }

  return sorter;
};

const service = {
  fetchItems: (payload) => {
    const user_id = localStorage.getItem("user_sub");
    if (!user_id) {
      return Promise.reject(new Error("User ID not found"));
    }

    return fetch(`${serverUrl}/cards/${user_id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching items: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        return [];
      });
  },

  create: (card) => {
    const user_id = localStorage.getItem("user_sub");
    if (!user_id) {
      return Promise.reject(new Error("User ID not found"));
    }

    return fetch(`${serverUrl}/cards`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        card_id: null,
        user_id,
        user_names: null,
        telephone_numbers: card.phone ? [card.phone] : [""],
        email_addresses: card.email ? [card.email] : [""],
        company_name: card.name || "",
        company_website: card.website || "",
        company_address: card.address || "",
        image_storage: card.image_url || "",
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error creating item: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  },

  update: (data) => {
    const user_id = localStorage.getItem("user_sub");
    if (!user_id) {
      return Promise.reject(new Error("User ID not found"));
    }

    data.user_id = user_id;

    return fetch(`${serverUrl}/cards`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error updating item: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  },

  delete: (data) => {
    const user_id = localStorage.getItem("user_sub");
    if (!user_id) {
      return Promise.reject(new Error("User ID not found"));
    }

    return fetch(`${serverUrl}/cards/${user_id}/${data.card_id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting item: ${response.statusText}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  },
};

const styles = {
  container: { margin: "auto", width: "fit-content" },
};

function List(props) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("user_sub")) {
      window.location = "/login";
    }
  }, []);

  const handleSearchChange = (event) => {
    let searchTerm = event.target.value;
    setSearch(searchTerm);

    service.fetchItems(); // Adjusted this to handle search if applicable
  };

  return (
    <div>
      <div style={styles.container}>
        <CRUDTable
          caption="Cards"
          fetchItems={(payload) => service.fetchItems(payload)}
        >
          <Fields>
            <Field name="id" label="Id" hideInCreateForm readOnly />
            <Field name="name" label="Name" />
            <Field name="phone" label="Phone" />
            <Field name="email" label="Email" />
            <Field name="website" label="Website" />
            <Field
              name="address"
              label="Address"
              render={DescriptionRenderer}
            />
          </Fields>

          <CreateForm
            title="Card Creation"
            message="Create a new card!"
            trigger="Create Card"
            onSubmit={(card) => service.create(card)}
            submitText="Create"
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "Please provide a name";
              }
              if (!values.phone) {
                errors.phone = "Please provide a phone number";
              }
              return errors;
            }}
          />

          <UpdateForm
            title="Card Update Process"
            message="Update card details"
            trigger="Update"
            onSubmit={(card) => service.update(card)}
            submitText="Update"
            validate={(values) => {
              const errors = {};
              if (!values.id) {
                errors.id = "Please provide an id";
              }
              if (!values.name) {
                errors.name = "Please provide a name";
              }
              if (!values.email) {
                errors.email = "Please provide an email";
              }
              return errors;
            }}
          />

          <DeleteForm
            title="Card Delete Process"
            message="Are you sure you want to delete the card?"
            trigger="Delete"
            onSubmit={(task) => service.delete(task)}
            submitText="Delete"
            validate={(values) => {
              const errors = {};
              if (!values.id) {
                errors.id = "Please provide an id";
              }
              return errors;
            }}
          />
        </CRUDTable>
      </div>
    </div>
  );
}

export default List;
