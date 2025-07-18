import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { verifyUser } from "../../services/UsersApi";

export default function VerifyUserPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!id) return;
    console.log(id);
    setLoading(true);
    try {
      const resp = await verifyUser(id);
      console.log(resp.data);
      toast.success("Account verified! You can now log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data || err.message || "Verification failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <h1>Please verify your account by clicking the button below</h1>
      <button onClick={handleVerify} type="submit" className="btn-orange">
        {loading ? (
          <Loader className="btn-loader" size={20} />
        ) : (
          "Verify account"
        )}
      </button>
    </div>
  );
}
