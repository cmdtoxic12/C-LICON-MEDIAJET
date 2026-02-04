const paymentForm = document.getElementById('paymentForm');

paymentForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const email = document.getElementById("email-address").value;
    const amount = document.getElementById("amount").value;

    // Initialize Paystack Pop
    const paystack = new PaystackPop();

    paystack.newTransaction({
        key: 'YOUR_PUBLIC_KEY_HERE', // Replace with your Public Key
        email: email,
        amount: amount * 100, // Paystack works in kobo/cents (Multiply by 100)
        currency: 'USD', // You can change this to GHS, NGN, ZAR, etc.
        // Inside paystack.newTransaction logic in app.js
onSuccess: async (transaction) => {
    // 1. Inform the user we are verifying
    document.getElementById('pay-button').innerText = "Verifying...";

    // 2. Call your Vercel Serverless Function
    const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: transaction.reference })
    });

    const result = await response.json();

    if (result.status === 'success') {
        alert("Payment verified and complete!");
        window.location.href = "/success-page.html"; 
    } else {
        alert("Payment failed verification.");
    }
}
});

