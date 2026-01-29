"use client";

import Pagination from "../../components/Pagination/Pagination";
import { Save } from "lucide-react";

import Basic from "./Forms/Basic";
import Family from "./Forms/Family";
import Location from "./Forms/Location";
import Administrative from "./Forms/Administrative";
import People from "./Forms/People";

import { useEffect, useState } from "react";
import { saveInfo } from "./SaveActions/saveInfo";

export default function Form({
  data,
  basicFormValues,
  adminFormValues,
  peopleFormValues,
  projectID,
}) {
  const [current, setCurrent] = useState(0);

  const [basicsForm, setBasicsForm] = useState(data.basicsData);
  const [familyForm, setFamilyForm] = useState(data.familiesData);
  const [locationForm, setLocationForm] = useState(data.locationsData);
  const [adminForm, setAdminForm] = useState(data.adminsData);
  const [peopleForm, setPeopleForm] = useState(data.peopleData);

  const projectSlug = data.projectSlug;

  useEffect(() => {
    const interval = setInterval(async () => {
      await saveInfo(
        basicsForm,
        locationForm,
        adminForm,
        peopleForm,
        projectID,
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full h-full flex flex-col items-center justify-center p-3 gap-3">
      <h1>{data.projectName}</h1>

      <Pagination current={current} setCurrent={setCurrent}></Pagination>

      {current == 0 && (
        <Basic
          basicsForm={basicsForm}
          setBasicsForm={setBasicsForm}
          formValues={basicFormValues}
        ></Basic>
      )}
      {current == 1 && (
        <Family
          familyForm={familyForm}
          setFamilyForm={setFamilyForm}
          projectSlug={projectSlug}
          projectID={projectID}
        ></Family>
      )}
      {current == 2 && (
        <Location
          projectSlug={projectSlug}
          locationForm={locationForm}
          setLocationForm={setLocationForm}
        ></Location>
      )}
      {current == 3 && (
        <Administrative
          adminForm={adminForm}
          setAdminForm={setAdminForm}
          formValues={adminFormValues}
        ></Administrative>
      )}
      {current == 4 && (
        <People
          peopleForm={peopleForm}
          setPeopleForm={setPeopleForm}
          formValues={peopleFormValues}
        ></People>
      )}

      <button
        className="btn btn-success fixed bottom-5 right-5 z-10"
        onClick={async () =>
          await saveInfo(
            basicsForm,
            locationForm,
            adminForm,
            peopleForm,
            projectID,
          ).then(() => window.location.reload())
        }
      >
        <Save size={30}></Save>
      </button>
    </main>
  );
}
