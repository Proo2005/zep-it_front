"use client"

export default function RazorpayButton() {
  const handlePayment = async () => {
    const res = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500 }),
    })

    const order = await res.json()

    const options = {
      key: "rzp_test_xxxxxxxx", // same key id
      amount: order.amount,
      currency: order.currency,
      name: "Demo Store",
      description: "Test Transaction",
      order_id: order.id,
      handler: function (response) {
        alert("Payment Successful")
        console.log(response)
      },
      theme: {
        color: "#0C831F",
      },
    }

    const razor = new window.Razorpay(options)
    razor.open()
  }

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-3 bg-green-600 text-white rounded-lg"
    >
      Pay with Razorpay
    </button>
  )
}
