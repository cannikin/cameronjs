// See https://cameronjs.com/stimulus for more info

import { Controller } from "stimulus";

export default class extends Controller {
  connect() {
    console.info("CameronJS Connected.");
  }
}
