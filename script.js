/* =========================================
   BUSGO - BUS BOOKING WEBSITE
========================================= */


/* =========================================
   MOCK BUS DATA
========================================= */

const buses = [

    {
        id: 1,
        operator: "KPN Travels",
        type: "AC Sleeper",
        from: "Chennai",
        to: "Bangalore",
        departure: "21:30",
        arrival: "04:00",
        duration: "6h 30m",
        price: 899,
        rating: 4.5,
        seats: 12
    },

    {
        id: 2,
        operator: "SRS Travels",
        type: "AC Sleeper",
        from: "Chennai",
        to: "Bangalore",
        departure: "22:00",
        arrival: "05:00",
        duration: "7h",
        price: 999,
        rating: 4.7,
        seats: 8
    },

    {
        id: 3,
        operator: "VRL Travels",
        type: "AC",
        from: "Chennai",
        to: "Bangalore",
        departure: "20:45",
        arrival: "03:30",
        duration: "6h 45m",
        price: 799,
        rating: 4.3,
        seats: 15
    },

    {
        id: 4,
        operator: "Orange Tours",
        type: "Semi-Sleeper",
        from: "Chennai",
        to: "Bangalore",
        departure: "23:00",
        arrival: "06:00",
        duration: "7h",
        price: 699,
        rating: 4.2,
        seats: 20
    },

    {
        id: 5,
        operator: "IntrCity SmartBus",
        type: "AC",
        from: "Chennai",
        to: "Bangalore",
        departure: "19:30",
        arrival: "02:30",
        duration: "7h",
        price: 849,
        rating: 4.6,
        seats: 10
    },

    {
        id: 6,
        operator: "Parveen Travels",
        type: "Non-AC",
        from: "Chennai",
        to: "Bangalore",
        departure: "18:30",
        arrival: "01:30",
        duration: "7h",
        price: 599,
        rating: 4.1,
        seats: 18
    },

    {
        id: 7,
        operator: "SRM Travels",
        type: "AC Sleeper",
        from: "Chennai",
        to: "Bangalore",
        departure: "21:00",
        arrival: "04:15",
        duration: "7h 15m",
        price: 949,
        rating: 4.4,
        seats: 9
    },

    {
        id: 8,
        operator: "YBM Travels",
        type: "Semi-Sleeper",
        from: "Chennai",
        to: "Bangalore",
        departure: "22:30",
        arrival: "05:30",
        duration: "7h",
        price: 749,
        rating: 4.3,
        seats: 14
    },

    {
        id: 9,
        operator: "KPN Travels",
        type: "AC",
        from: "Chennai",
        to: "Coimbatore",
        departure: "22:00",
        arrival: "05:30",
        duration: "7h 30m",
        price: 699,
        rating: 4.5,
        seats: 13
    },

    {
        id: 10,
        operator: "SRS Travels",
        type: "Sleeper",
        from: "Chennai",
        to: "Madurai",
        departure: "21:00",
        arrival: "05:00",
        duration: "8h",
        price: 599,
        rating: 4.4,
        seats: 10
    },

    {
        id: 11,
        operator: "Orange Tours",
        type: "AC Sleeper",
        from: "Chennai",
        to: "Hyderabad",
        departure: "19:00",
        arrival: "07:00",
        duration: "12h",
        price: 1199,
        rating: 4.6,
        seats: 8
    },

    {
        id: 12,
        operator: "TNSTC",
        type: "Non-AC",
        from: "Chennai",
        to: "Pondicherry",
        departure: "08:00",
        arrival: "11:30",
        duration: "3h 30m",
        price: 299,
        rating: 4.0,
        seats: 25
    }

];


/* =========================================
   GLOBAL VARIABLES
========================================= */

let currentBuses = [];

let selectedBus = null;

let selectedSeats = [];

let selectedPassengers = [];

let bookingData = null;

let currentPaymentMethod = "upi";


/* =========================================
   SECTION HELPERS
========================================= */

const sections = [

    "homeSection",
    "resultsSection",
    "seatSection",
    "passengerSection",
    "paymentSection",
    "confirmationSection",
    "bookingsSection"

];


function hideAllSections() {

    sections.forEach(id => {

        document
            .getElementById(id)
            .classList.add("hidden");

    });

}


/* =========================================
   HOME
========================================= */

function showHome() {

    hideAllSections();

    document
        .getElementById("homeSection")
        .classList.remove("hidden");

    window.scrollTo(0, 0);
}


/* =========================================
   SEARCH BUSES
========================================= */

function searchBuses() {

    const from =
        document.getElementById("fromCity").value;

    const to =
        document.getElementById("toCity").value;

    const date =
        document.getElementById("travelDate").value;

    const passengers =
        Number(document.getElementById("passengers").value);


    if (!from || !to) {

        alert("Please select From and To cities.");

        return;
    }


    if (from === to) {

        alert("From and To cities cannot be the same.");

        return;
    }


    if (!date) {

        alert("Please select a travel date.");

        return;
    }


    localStorage.setItem(
        "searchData",
        JSON.stringify({
            from,
            to,
            date,
            passengers
        })
    );


    currentBuses = buses.filter(bus =>

        bus.from === from &&
        bus.to === to

    );


    displaySearchResults();

}


/* =========================================
   QUICK SEARCH
========================================= */

function quickSearch(from, to) {

    document.getElementById("fromCity").value = from;

    document.getElementById("toCity").value = to;


    const tomorrow = new Date();

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    document.getElementById("travelDate").value =
        tomorrow.toISOString().split("T")[0];


    searchBuses();
}


/* =========================================
   DISPLAY RESULTS
========================================= */

function displaySearchResults() {

    hideAllSections();

    document
        .getElementById("resultsSection")
        .classList.remove("hidden");


    const search =
        JSON.parse(
            localStorage.getItem("searchData")
        );


    document.getElementById("routeTitle").textContent =
        `${search.from} → ${search.to}`;


    document.getElementById("searchInfo").textContent =
        `${search.date} • ${search.passengers} Passenger(s)`;


    applyFilters();


    window.scrollTo(0, 0);
}


/* =========================================
   FILTER + SORT
========================================= */

function applyFilters() {

    const type =
        document.getElementById("typeFilter").value;

    const sort =
        document.getElementById("sortFilter").value;


    let filtered = [...currentBuses];


    if (type !== "all") {

        filtered = filtered.filter(bus =>

            bus.type.includes(type)

        );

    }


    if (sort === "low") {

        filtered.sort(
            (a, b) => a.price - b.price
        );

    }


    if (sort === "high") {

        filtered.sort(
            (a, b) => b.price - a.price
        );

    }


    if (sort === "rating") {

        filtered.sort(
            (a, b) => b.rating - a.rating
        );

    }


    displayBuses(filtered);
}


/* =========================================
   BUS CARDS
========================================= */

function displayBuses(list) {

    const container =
        document.getElementById("busList");


    if (list.length === 0) {

        container.innerHTML = `
            <div class="summary-card">
                <h2>No buses found</h2>
                <p>
                    Try changing your route or filter.
                </p>
            </div>
        `;

        return;
    }


    container.innerHTML = list.map(bus => `

        <div class="bus-card">

            <div class="bus-operator">

                <h3>${bus.operator}</h3>

                <p class="bus-type">
                    ${bus.type}
                </p>

            </div>


            <div>

                <div class="time">
                    ${bus.departure}
                </div>

                <div class="location">
                    ${bus.from}
                </div>

            </div>


            <div>

                <div class="bus-type">
                    ${bus.duration}
                </div>

                <div class="bus-type">
                    →
                </div>

            </div>


            <div>

                <div class="time">
                    ${bus.arrival}
                </div>

                <div class="location">
                    ${bus.to}
                </div>

            </div>


            <div>

                <div class="rating">
                    ★ ${bus.rating}
                </div>

                <div class="price">
                    ₹${bus.price}
                </div>

                <div class="seats-left">
                    ${bus.seats} seats left
                </div>

                <button
                    class="select-btn"
                    onclick="selectBus(${bus.id})"
                >
                    Select Seats
                </button>

            </div>

        </div>

    `).join("");

}


/* =========================================
   SELECT BUS
========================================= */

function selectBus(id) {

    selectedBus =
        buses.find(bus => bus.id === id);


    selectedSeats = [];


    localStorage.setItem(
        "selectedBus",
        JSON.stringify(selectedBus)
    );


    showSeats();
}


/* =========================================
   SEAT SECTION
========================================= */

function showSeats() {

    hideAllSections();

    document
        .getElementById("seatSection")
        .classList.remove("hidden");


    displaySelectedBus();

    createSeats();

    updateSummary();


    window.scrollTo(0, 0);
}


/* =========================================
   SELECTED BUS INFORMATION
========================================= */

function displaySelectedBus() {

    const container =
        document.getElementById("selectedBusInfo");


    container.innerHTML = `

        <div class="page-header">

            <div>

                <p class="small-title">
                    SELECT SEAT
                </p>

                <h2>
                    ${selectedBus.operator}
                </h2>

                <p>
                    ${selectedBus.type} •
                    ${selectedBus.from}
                    →
                    ${selectedBus.to}
                </p>

            </div>

        </div>

    `;


    document.getElementById("summaryBus").innerHTML = `

        <strong>${selectedBus.operator}</strong>

        <p>
            ${selectedBus.from}
            →
            ${selectedBus.to}
        </p>

        <p>
            ${selectedBus.departure}
            →
            ${selectedBus.arrival}
        </p>

    `;
}


/* =========================================
   CREATE SEATS
========================================= */

function createSeats() {

    const seatMap =
        document.getElementById("seatMap");


    seatMap.innerHTML = "";


    const totalSeats = 20;

    const bookedSeats = [
        "A1",
        "A4",
        "B2",
        "C3",
        "D1",
        "E4"
    ];


    for (let i = 1; i <= totalSeats; i++) {

        const row =
            String.fromCharCode(
                65 + Math.floor((i - 1) / 4)
            );

        const number =
            ((i - 1) % 4) + 1;

        const seatId =
            row + number;


        const seat =
            document.createElement("div");


        seat.classList.add("seat");

        seat.textContent = seatId;


        if (bookedSeats.includes(seatId)) {

            seat.classList.add("booked");

        } else {

            seat.onclick = () =>
                selectSeat(seatId, seat);

        }


        /*
         * Create an aisle after every
         * second seat.
         */

        if (number === 3) {

            const aisle =
                document.createElement("div");

            aisle.style.gridColumn = "3";

        }


        seatMap.appendChild(seat);

    }

}


/* =========================================
   SELECT SEAT
========================================= */

function selectSeat(seatId, element) {

    const maxPassengers =
        Number(
            document.getElementById("passengers").value
        );


    if (selectedSeats.includes(seatId)) {

        selectedSeats =
            selectedSeats.filter(
                seat => seat !== seatId
            );

        element.classList.remove("selected");

    } else {

        if (
            selectedSeats.length >=
            maxPassengers
        ) {

            alert(
                `You can select only ${maxPassengers} seat(s).`
            );

            return;
        }


        selectedSeats.push(seatId);

        element.classList.add("selected");

    }


    updateSummary();
}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    const seatText =
        document.getElementById(
            "selectedSeatsText"
        );


    const ticketFare =
        document.getElementById("ticketFare");


    const gstElement =
        document.getElementById("gst");


    const totalElement =
        document.getElementById("totalFare");


    if (selectedSeats.length === 0) {

        seatText.textContent = "None";

        ticketFare.textContent = "₹0";

        gstElement.textContent = "₹0";

        totalElement.textContent = "₹0";

        return;
    }


    const fare =
        selectedSeats.length *
        selectedBus.price;


    const gst =
        Math.round(fare * 0.05);


    const total =
        fare + gst + 30;


    seatText.textContent =
        selectedSeats.join(", ");


    ticketFare.textContent =
        `₹${fare}`;


    gstElement.textContent =
        `₹${gst}`;


    totalElement.textContent =
        `₹${total}`;
}


/* =========================================
   CONTINUE TO PASSENGER
========================================= */

function continueToPassenger() {

    if (selectedSeats.length === 0) {

        alert("Please select at least one seat.");

        return;
    }


    showPassenger();
}


/* =========================================
   PASSENGER SECTION
========================================= */

function showPassenger() {

    hideAllSections();

    document
        .getElementById("passengerSection")
        .classList.remove("hidden");


    createPassengerForms();

    window.scrollTo(0, 0);
}


/* =========================================
   CREATE PASSENGER FORMS
========================================= */

function createPassengerForms() {

    const container =
        document.getElementById(
            "passengerForms"
        );


    container.innerHTML = "";


    selectedSeats.forEach(
        (seat, index) => {

            container.innerHTML += `

                <div class="passenger-form">

                    <h3>
                        Passenger ${index + 1}
                        — Seat ${seat}
                    </h3>


                    <div class="form-grid">

                        <div class="input-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                class="passenger-name"
                                data-seat="${seat}"
                                placeholder="Passenger name"
                            >

                        </div>


                        <div class="input-group">

                            <label>
                                Age
                            </label>

                            <input
                                type="number"
                                class="passenger-age"
                                min="1"
                                max="100"
                                placeholder="Age"
                            >

                        </div>


                        <div class="input-group">

                            <label>
                                Gender
                            </label>

                            <select
                                class="passenger-gender"
                            >

                                <option value="">
                                    Select gender
                                </option>

                                <option>
                                    Male
                                </option>

                                <option>
                                    Female
                                </option>

                                <option>
                                    Other
                                </option>

                            </select>

                        </div>

                    </div>

                </div>

            `;

        }
    );

}


/* =========================================
   CONTINUE TO PAYMENT
========================================= */

function continueToPayment() {

    const names =
        document.querySelectorAll(
            ".passenger-name"
        );


    const ages =
        document.querySelectorAll(
            ".passenger-age"
        );


    const genders =
        document.querySelectorAll(
            ".passenger-gender"
        );


    const email =
        document.getElementById("email").value.trim();


    const phone =
        document.getElementById("phone").value.trim();


    const terms =
        document.getElementById("terms").checked;


    if (!email || !phone) {

        alert(
            "Please enter your contact information."
        );

        return;
    }


    if (!terms) {

        alert(
            "Please agree to the Terms & Conditions."
        );

        return;
    }


    selectedPassengers = [];


    for (
        let i = 0;
        i < names.length;
        i++
    ) {

        if (
            !names[i].value ||
            !ages[i].value ||
            !genders[i].value
        ) {

            alert(
                "Please complete all passenger details."
            );

            return;
        }


        selectedPassengers.push({

            name: names[i].value,

            age: ages[i].value,

            gender: genders[i].value,

            seat: selectedSeats[i]

        });

    }


    bookingData = {

        bus: selectedBus,

        seats: [...selectedSeats],

        passengers: [...selectedPassengers],

        email,

        phone

    };


    showPayment();
}


/* =========================================
   PAYMENT
========================================= */

function showPayment() {

    hideAllSections();

    document
        .getElementById("paymentSection")
        .classList.remove("hidden");


    updatePaymentSummary();

    window.scrollTo(0, 0);
}


/* =========================================
   PAYMENT METHOD
========================================= */

function selectPayment(method, button) {

    currentPaymentMethod = method;


    document
        .querySelectorAll(".payment-tab")
        .forEach(tab =>
            tab.classList.remove("active")
        );


    button.classList.add("active");


    const form =
        document.getElementById(
            "paymentForm"
        );


    if (method === "upi") {

        form.innerHTML = `

            <div class="input-group">

                <label>UPI ID</label>

                <input
                    type="text"
                    id="upi"
                    placeholder="example@upi"
                >

            </div>

        `;

    }


    if (method === "card") {

        form.innerHTML = `

            <div class="input-group">

                <label>Card Number</label>

                <input
                    type="text"
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                >

            </div>


            <br>


            <div class="form-grid">

                <div class="input-group">

                    <label>Expiry</label>

                    <input
                        type="text"
                        id="expiry"
                        placeholder="MM/YY"
                    >

                </div>


                <div class="input-group">

                    <label>CVV</label>

                    <input
                        type="password"
                        id="cvv"
                        placeholder="123"
                    >

                </div>

            </div>

        `;

    }


    if (method === "bank") {

        form.innerHTML = `

            <div class="input-group">

                <label>Select Bank</label>

                <select id="bank">

                    <option value="">
                        Select Bank
                    </option>

                    <option>State Bank of India</option>
                    <option>HDFC Bank</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>

                </select>

            </div>

        `;

    }

}


/* =========================================
   PAYMENT SUMMARY
========================================= */

function updatePaymentSummary() {

    const fare =
        selectedSeats.length *
        selectedBus.price;


    const gst =
        Math.round(fare * 0.05);


    const total =
        fare + gst + 30;


    document.getElementById(
        "paymentSummary"
    ).innerHTML = `

        <div class="summary-row">

            <span>Bus</span>

            <strong>
                ${selectedBus.operator}
            </strong>

        </div>


        <div class="summary-row">

            <span>Route</span>

            <strong>
                ${selectedBus.from}
                →
                ${selectedBus.to}
            </strong>

        </div>


        <div class="summary-row">

            <span>Seats</span>

            <strong>
                ${selectedSeats.join(", ")}
            </strong>

        </div>


        <div class="summary-row">

            <span>Ticket Fare</span>

            <strong>
                ₹${fare}
            </strong>

        </div>


        <div class="summary-row">

            <span>GST</span>

            <strong>
                ₹${gst}
            </strong>

        </div>


        <div class="summary-row">

            <span>Convenience Fee</span>

            <strong>
                ₹30
            </strong>

        </div>


        <hr>


        <div class="total-row">

            <span>Total</span>

            <strong>
                ₹${total}
            </strong>

        </div>

    `;
}


/* =========================================
   PROCESS PAYMENT
========================================= */

function processPayment() {

    const button =
        document.querySelector(
            "#paymentSection .primary-btn"
        );


    button.disabled = true;

    button.textContent =
        "Processing Payment...";


    setTimeout(() => {

        completeBooking();

    }, 1500);

}


/* =========================================
   COMPLETE BOOKING
========================================= */

function completeBooking() {

    const bookingId =
        "BG" +
        Math.floor(
            100000 + Math.random() * 900000
        );


    const fare =
        selectedSeats.length *
        selectedBus.price;


    const gst =
        Math.round(fare * 0.05);


    const total =
        fare + gst + 30;


    const search =
        JSON.parse(
            localStorage.getItem("searchData")
        );


    bookingData = {

        id: bookingId,

        bus: selectedBus,

        seats: [...selectedSeats],

        passengers: [...selectedPassengers],

        email: bookingData.email,

        phone: bookingData.phone,

        date: search.date,

        total,

        status: "Confirmed"

    };


    let bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    bookings.push(bookingData);


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    displayConfirmation();

}


/* =========================================
   CONFIRMATION
========================================= */

function displayConfirmation() {

    hideAllSections();

    document
        .getElementById(
            "confirmationSection"
        )
        .classList.remove("hidden");


    const passenger =
        bookingData.passengers[0];


    document.getElementById(
        "ticket"
    ).innerHTML = `

        <div class="ticket">

            <div class="ticket-header">

                <div>

                    <strong>
                        🚌 BusGo
                    </strong>

                    <p>
                        Bus Ticket
                    </p>

                </div>

                <div>

                    <strong>
                        ${bookingData.id}
                    </strong>

                </div>

            </div>


            <div class="ticket-grid">

                <div class="ticket-item">

                    <small>Passenger</small>

                    <strong>
                        ${passenger.name}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>Seat</small>

                    <strong>
                        ${bookingData.seats.join(", ")}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>Bus</small>

                    <strong>
                        ${bookingData.bus.operator}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>Bus Type</small>

                    <strong>
                        ${bookingData.bus.type}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>From</small>

                    <strong>
                        ${bookingData.bus.from}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>To</small>

                    <strong>
                        ${bookingData.bus.to}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>Date</small>

                    <strong>
                        ${bookingData.date}
                    </strong>

                </div>


                <div class="ticket-item">

                    <small>Departure</small>

                    <strong>
                        ${bookingData.bus.departure}
                    </strong>

                </div>

            </div>


            <div class="ticket-total">

                <span>Total Paid</span>

                <span>
                    ₹${bookingData.total}
                </span>

            </div>

        </div>

    `;


    window.scrollTo(0, 0);

}


/* =========================================
   MY BOOKINGS
========================================= */

function showBookings() {

    hideAllSections();

    document
        .getElementById("bookingsSection")
        .classList.remove("hidden");


    displayBookings();

    window.scrollTo(0, 0);
}


/* =========================================
   DISPLAY BOOKINGS
========================================= */

function displayBookings() {

    const container =
        document.getElementById(
            "bookingsList"
        );


    const bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    if (bookings.length === 0) {

        container.innerHTML = `

            <div class="summary-card">

                <h2>No bookings yet</h2>

                <p>
                    Your booked journeys will appear here.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        bookings.map((booking, index) => `

        <div class="booking-card">

            <div>

                <p class="small-title">
                    ${booking.id}
                </p>

                <h3>
                    ${booking.bus.from}
                    →
                    ${booking.bus.to}
                </h3>

                <p>
                    ${booking.bus.operator}
                    •
                    ${booking.seats.join(", ")}
                </p>

                <p>
                    ${booking.date}
                </p>

                <p>
                    ₹${booking.total}
                </p>

            </div>


            <div>

                <p class="
                    booking-status
                    ${booking.status === "Cancelled"
                        ? "cancelled"
                        : ""}
                ">

                    ${booking.status}

                </p>


                ${
                    booking.status !== "Cancelled"

                    ?

                    `
                    <button
                        class="cancel-btn"
                        onclick="cancelBooking(${index})"
                    >
                        Cancel Booking
                    </button>
                    `

                    :

                    ""

                }

            </div>

        </div>

    `).join("");

}


/* =========================================
   CANCEL BOOKING
========================================= */

function cancelBooking(index) {

    if (
        !confirm(
            "Are you sure you want to cancel this booking?"
        )
    ) {

        return;

    }


    let bookings =
        JSON.parse(
            localStorage.getItem("bookings")
        ) || [];


    bookings[index].status =
        "Cancelled";


    localStorage.setItem(
        "bookings",
        JSON.stringify(bookings)
    );


    displayBookings();

}


/* =========================================
   SWAP CITIES
========================================= */

function swapCities() {

    const from =
        document.getElementById("fromCity");

    const to =
        document.getElementById("toCity");


    const temp = from.value;

    from.value = to.value;

    to.value = temp;

}


/* =========================================
   MOBILE MENU
========================================= */

function toggleMenu() {

    document
        .getElementById("navMenu")
        .classList.toggle("show");

}


/* =========================================
   INITIAL DATE
========================================= */

function setDefaultDate() {

    const date =
        new Date();


    date.setDate(
        date.getDate() + 1
    );


    document.getElementById(
        "travelDate"
    ).value =
        date.toISOString().split("T")[0];

}


setDefaultDate();


/* =========================================
   INITIAL STATE
========================================= */

showHome();