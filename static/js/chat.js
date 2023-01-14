"use strict";

/** Client-side of groupchat. */

const urlParts = document.URL.split("/");
const roomName = urlParts[urlParts.length - 1];
const ws = new WebSocket(`ws://localhost:3000/chat/${roomName}`);

const name = prompt("Username? (no spaces)");

/** called when connection opens, sends join info to server. */

ws.onopen = function (evt) {
  console.log("open", evt);

  let data = { type: "join", name: name };
  ws.send(JSON.stringify(data));
};

/** called when msg received from server; displays it. */

ws.onmessage = function (evt) {
  console.log("message", evt);

  let msg = JSON.parse(evt.data);
  let item;

  if (msg.type === "note") {
    item = $(`<li><i>${msg.text}</i></li>`);
  } else if (msg.type === "chat") {
    item = $(`<li><b>${msg.name}: </b>${msg.text}</li>`);
  } else if (msg.type === "joke") {
    item = $(
      `<li><b> Bot: </b>People are making apocalypse jokes like there’s no tomorrow.</li>`
    );
  } else if (msg.type === "members") {
    item = $(`<li><b> Bot: </b>List of people in the room: ${msg.text}</li>`);
  } else if (msg.type === "private-message") {

  }else {
    return console.error(`bad message: ${msg}`);
  }

  $("#messages").append(item);
};

/** called on error; logs it. */

ws.onerror = function (evt) {
  console.error(`err ${evt}`);
};

/** called on connection-closed; logs it. */

ws.onclose = function (evt) {
  console.log("close", evt);
};

/** send message when button pushed. */

$("form").submit(function (evt) {
  evt.preventDefault();

  let data;

  const msgVal = $("#m").val()
  console.log("🚀 ~ file: chat.js:65 ~ msgVal", msgVal)


  // if value of field is '/joke' then send back data with type of get joke
  if (msgVal.indexOf('/joke') === 0) {
  // if ($("#m").val() === "/joke") {
    data = { type: "joke" };
  } else if (msgVal.indexOf('/members') === 0) {
  // } else if ($("#m").val() === "/members") {
    data = { type: "members" };
  } else if (msgVal.indexOf('/priv') === 0) {
  // } else if ($("#m").val().indexOf('/priv') === 0) {
  // } else if ($("#m").val().splits(" ")[0] === '/priv') {
  // } else if ($("#m").val().startsWith("/priv")) {
    console.log("cars");
    [command, pmUser, ...msg] = $("#m").val().split(" ");
    // TODO: getting command is not defined here^. try using index of and/or splitting to get values
    msg = msg.join(" ");
    data = { pmUser, type: "private-message", text: msg };
  } else {
    data = { type: "chat", text: $("#m").val() };
  }
  ws.send(JSON.stringify(data));

  $("#m").val("");
});
