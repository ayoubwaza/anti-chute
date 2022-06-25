const spSheet =
  "https://script.google.com/macros/s/AKfycbwkxfu5Q8aiAidv7AcGbRpHI6z2rRbidvqUdqK7uLZWu7Xb6rFWKnM7zOK3pXwVW4AmKw/exec";
var request;
$(".request-form").on("submit", function (e) {
  e.preventDefault();
  if (request) {
    request.abort();
  }
  var $form = $(this);
  var $inputs = $form.find("input, select, button, textarea");
  const btnSubmitted = document.querySelectorAll("submitbutton");
  btnSubmitted.forEach((btn) => {
    btn.style.opacity = "0.5";
    btn.style.pointerEvents = "none";
    btn.innerHTML = "المرجو الإنتظار...";
  });

  var serializedData = $form.serialize();
  $inputs.prop("disabled", false);
  e.preventDefault();
  var request = $.ajax({
    url: spSheet,
    method: "POST",
    dataType: "jsonp",
    data: serializedData,
    success: function () {
      console.log("it worked");
    },
  });
  /* fbq('track', 'Lead'); */
  request.always(function () {
    setTimeout(function () {
      const btnSubmitted = document.querySelectorAll("submitbutton");
      btnSubmitted.forEach((btn) => {
        btn.style.pointerEvents = "auto";
        btn.innerHTML = "تأكيد الطــلب";
      });
     
      window.location.href = "success.html";
    }, 300);
  });
});
