// Brunch automatically concatenates all files in your
// watched paths. Those paths can be configured at
// config.paths.watched in "brunch-config.js".
//
// However, those files will only be executed if
// explicitly imported. The only exception are files
// in vendor, which are never wrapped in imports and
// therefore are always executed.

// Import dependencies
//
// If you no longer want to use a dependency, remember
// to also remove its path from "config.paths.watched".
import "phoenix_html"

// Import local files
//
// Local files can be imported directly using relative
// paths "./socket" or full ones "web/static/js/socket".

// import socket from "./socket"
import socket from "./socket"

class App {
  static init() {
    var username = $("#username");
    var msgBody = $("#message");
    console.log("Initialized");

    // join the channel
    socket.onClose( e => console.log("Closed socket connection"));
    var channel = socket.channel("rooms:lobby", {});

    channel.join()
    .receive("ok", resp => { console.log("Joined the channel successfully", resp) })
    .receive("error", resp => { console.log("Unable to join the channel", resp) })

    msgBody.off("keypress")
      .on("keypress", e => {
        if (e.keyCode == 13) {
          console.log(`[${username.val()}] ${msgBody.val()}`);
          channel.push("new:message", {
            user: username.val(),
            body: msgBody.val()
          });
          msgBody.val("");
        }
      });

      // receive other channel broadcasts
      channel.on("new:message", msg => this.renderMessage(msg));
  }

  // render messages
  static renderMessage(msg) {
    var messages = $("#messages");
    messages.append(`<p><b>[${msg.user}]</b>: ${msg.body}</p>`)
  }
}

$( () => App.init() );
$(() => alert("document is ready!"));
export default App;
