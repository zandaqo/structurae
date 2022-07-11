import { assertEquals } from "../../tests/test_deps.ts";
import { View } from "../../view.ts";
import { BitArray } from "../../bit-array.ts";
import { BitArrayView } from "./index.ts";

// create a new instance of a view protocol
const protocol = new View();

// add our view type to the map of binary view types
protocol.Views.set("bitarray", BitArrayView);

class UserSettings {
  id = 0;
  settings = new BitArray();
}

const UserSettingsView = protocol.create<UserSettings>({
  $id: "UserSettings",
  type: "object",
  properties: {
    id: { type: "integer" },
    settings: {
      type: "string",
      btype: "bitarray",
      maxLength: BitArray.getLength(80) << 2,
    },
  },
}, UserSettings);

Deno.test("[BitArrayView] create a bit array view", () => {
  const BAView = protocol.create<BitArray>({
    type: "string",
    btype: "bitarray",
  });
  assertEquals(BAView, BitArrayView);
});

Deno.test("[BitArrayView] use bit array in an object view", () => {
  const settings = new BitArray(3);
  settings.setBit(0, 1);
  settings.setBit(10, 1);
  settings.setBit(79, 1);
  const view = UserSettingsView.from(new UserSettings());
  view.set("settings", settings);
  const array = view.get("settings");
  assertEquals(array instanceof BitArray, true);
  assertEquals(array!.getBit(0), 1);
  assertEquals(array!.getBit(1), 0);
  assertEquals(array!.getBit(10), 1);
  assertEquals(array!.getBit(79), 1);
});
