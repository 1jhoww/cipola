import { permanentRedirect } from "next/navigation";
// The viewer moved into the catalog for good.
export default function Page() {
  permanentRedirect("/materiais");
}
