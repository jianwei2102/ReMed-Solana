import { useLocation } from "react-router-dom";

const ModifyRecord = () => {
  const location = useLocation();

  console.log("Props passed to ModifyRecord:", location.state);

  return (
    <div>
      <h2>Modify Record</h2>
      <p>Name: {location.state?.name}</p>
      <p>Age: {location.state?.age}</p>
    </div>
  );
};

export default ModifyRecord;
