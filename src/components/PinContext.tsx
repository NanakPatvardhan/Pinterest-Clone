import { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";



type Pin = {
    id: number;
    title:string;
    image:string;
    description: string;
    category: string;
};




type PinContextType = {
    pins: Pin[];
    savedPins: number[];
    setPins: React.Dispatch<React.SetStateAction<Pin[]>>;
    setSavedPins: React.Dispatch<React.SetStateAction<number[]>>;
    loading: boolean;
    error: string | null;
    handleSave: (pinId: number) => Promise<void>;
    deletePin: (pinId: number) => Promise<void>;
    updatePin: (
      pinId: number,
      updatedData: {
        title: string;
        image: string;
        description: string;
        category: string;
      }
    ) => Promise<void>;
    addPin: (newPin:Pin) => Promise<void>;
};

export const PinContext = createContext<PinContextType | null>(null);

export function PinProvider({children}: { children: React.ReactNode}) {

  const authContext = useContext(AuthContext);

if (!authContext) {
  throw new Error("PinProvider must be used inside AuthProvider");
}

const { token, authLoading } = authContext;
    const [pins, setPins] = useState<Pin[]>([]);
    const [savedPins, setSavedPins] =useState<number[]> ([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (authLoading) {
  return;
}

if (!token) {
  setPins([]);
  setSavedPins([]);
  setError(null);
  setLoading(false);
  return;
}
        async function getPins() {
          try {const response = await fetch("http://localhost:5000/api/pins", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (!response.ok) {
  throw new Error("Failed to fetch pins");
}

const data: Pin[] = await response.json();

setPins(data);
const savedResponse = await fetch(
  "http://localhost:5000/api/saved-pins",
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

if (!savedResponse.ok) {
  throw new Error("Failed to fetch saved pins");
}
const savedData: Pin[] = await savedResponse.json();

setSavedPins(savedData.map((pin) => pin.id));
            setLoading(false);

          } catch (error) {
            setError("Failed to load pins.");
            setLoading(false);
          }
        }

        getPins();
      }, [authLoading, token]);

    async function handleSave(pinId: number) {
  try {
    if (savedPins.includes(pinId)) {
      const response = await fetch(
        `http://localhost:5000/api/saved-pins/${pinId}`,
        {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
      );

      if (!response.ok) {
        throw new Error("Failed to unsave pin");
      }

      setSavedPins((current) =>
        current.filter((id) => id !== pinId)
      );

    } else {
      const response = await fetch(
        `http://localhost:5000/api/saved-pins/${pinId}`,
        {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
      );

      if (!response.ok) {
        throw new Error("Failed to save pin");
      }

      setSavedPins((current) => [...current, pinId]);
    }

  } catch (error) {
    setError("Failed to update saved pins.");
  }
}

 async function deletePin(pinId: number) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/pins/${pinId}`,
      {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`,
  },
}
    );

    if (!response.ok) {
      throw new Error("Failed to delete pin");
    }

    setPins((currentPins) =>
      currentPins.filter((pin) => pin.id !== pinId)
    );

    setSavedPins((currentSavedPins) =>
      currentSavedPins.filter((id) => id !== pinId)
    );

  } catch (error) {
    setError("Failed to delete pin.");
  }
}

    async function updatePin(
  pinId: number,
  updatedData: {
    title: string;
    image: string;
    description: string;
    category: string;
  }
) {
  try {
    const response = await fetch(`http://localhost:5000/api/pins/${pinId}`, {
      method: "PUT",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error("Failed to update pin");
    }

    const updatedPin: Pin = await response.json();

    setPins((currentPins) =>
      currentPins.map((pin) =>
        pin.id === pinId ? updatedPin : pin
      )
    );

  } catch (error) {
    setError("Failed to update pin.");
  }
}



    async function addPin(newPin: Pin) {
  try {
    const response = await fetch("http://localhost:5000/api/pins", {
      method: "POST",
      headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
},
      body: JSON.stringify(newPin),
    });

    if (!response.ok) {
  const data = await response.json();
  throw new Error(data.error || "Failed to add pin");
}

    const createdPin: Pin = await response.json();

    setPins((currentPins) => [...currentPins, createdPin]);

  } catch (error) {
  setError(
    error instanceof Error ? error.message : "Failed to add pin."
  );
}
}





    return (
        <PinContext.Provider value={{ pins, savedPins, setPins, setSavedPins, loading, error, handleSave, deletePin, updatePin, addPin }}>
            {children}
            </PinContext.Provider>
    );
}