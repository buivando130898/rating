function infoRating() {
  let dateBegin = getValue("dateBegin");
  let dateEnd = getValue("dateEnd");
  data = {
    dateBegin,
    dateEnd,
    token,
  };
  console.log(data);
  axios
    .post(
      server + "/api/user.php/get_rating",
      { params: data },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then(function (response) {
      data = response.data;
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
      alert("Đã xảy ra lỗi!");
    });
}
