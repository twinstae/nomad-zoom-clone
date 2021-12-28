import http from "http";
import WebSocket from "ws";
import express from "express";
import { randomUUID } from "crypto";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let subscribers = [];

wss.on("connection", (socket) => {
  const id = randomUUID();
  subscribers = [...{ socket, nickname: "Anon", id }];
  console.log("connected! id: " + id);

  socket.on("close", () => {
    subscribers = subscribers.filter((browser) => browser.id !== id);
    console.log("closed! id: " + id);
  });

  socket.on("message", (message) => {
    const { type, payload } = JSON.parse(message);

    if (type === "new_message") {
      subscribers.forEach(({ nickname }) => {
        socket.send(`${nickname}:${payload.toString("utf-8")}`);
      });
    } else if (type === "nick") {
      subscribers = subscribers.map((browser) =>
        browser.id !== id ? browser : { ...browser, nickname: payload }
      );

      console.log("nick has been changed to " + payload + "! id:" + id);
    }
  });
});

server.listen(process.env.PORT, handleListen);
