"use client";

import { useState } from "react";

const ClientPage = () => {
  let [sections, setSections] = useState(null);
  return (
    <main className="lg:pt-[11rem]">
      {sections === null && (
        <div className="a-animation--container h-[55rem] my-4">
          <div className="a-animation--mask a-animation--effect"></div>
        </div>
      )}
    </main>
  );
};

export default ClientPage;
