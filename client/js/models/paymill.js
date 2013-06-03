function paymillResponseHandler(error, result) {
 if (error) {
   // Displays the error above the form
   $(".payment-errors").text(error.apierror);
 } else {
   var form = $("#payment-form");
   // Output token
   var token = result.token;
   // Insert token into form in order to submit to server
   form.append(
    "<input type='hidden' name='paymillToken' value='" + token + "'/>"
   );
   // Submit form
   form.get(0).submit();
 }
}