class Api {
  constructor({ baseUrl, headers }) {
    // constructor body
    this._baseUrl = baseUrl;
    this._headers = headers;
  }
  getAppInfo() {
    return Promise.all([this.getInitialCards(), this.getUserInfo()]);
  }

  getInitialCards() {
    // ...
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Error: ${res.status}`);
      });
  }

  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Error: ${res.status}`);
      });
  }

  editUserInfo({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        about,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Error: ${res.status}`);
      });
  }

  addNewPost({ name, link })  {
    return fetch(`${this._baseUrl}/cards`, { //Some ISsue here
      method: "POST",
      headers: this._headers,
      // Send the data in the body as a JSON string.
      body: JSON.stringify({
        name,
        link,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json()
        }
        return Promise.reject(`Error: ${res.status}`);
      });
    }

    deleteCard(id) {
      return fetch(`${this._baseUrl}/cards/${id}`, { //Some ISsue here
        method: "DELETE",
        headers: this._headers,
      })
        .then((res) => {
          if (res.ok) {
            return res.json()
          }
          return Promise.reject(`Error: ${res.status}`);
        });
    }
}

// export the class
export default Api;