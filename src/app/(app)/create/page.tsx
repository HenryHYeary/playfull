import { Suspense } from "react";
import Create from "./Create";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Create />
    </Suspense>
  );
}
