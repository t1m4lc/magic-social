import type { Database } from "~/supabase/supabase";

// Declare chrome as a global variable for TypeScript
declare const chrome: typeof globalThis extends { chrome: infer T } ? T : any;

export const useSendTokenToExtension = () => {
  const supabase = useSupabaseClient<Database>();

  const sendToken = async (): Promise<void> => {
    const { data } = await supabase.auth.getSession();
    const accessToken = data.session?.access_token;
    if (!accessToken) return;

    if (
      import.meta.client &&
      typeof chrome !== "undefined" &&
      chrome.runtime?.sendMessage
    ) {
      chrome.runtime.sendMessage(
        "bihnnpbmbplmblhmidddpepecdgpclgg",
        {
          type: "SUPABASE_LOGIN",
          token: accessToken,
          origin: window.location.origin,
        },
        () => {
          // Optionally handle response
          // console.log("token", accessToken);
        }
      );
    }
  };

  return { sendToken };
};

export const notifyExtensionLogout = (): void => {
  if (
    import.meta.client &&
    typeof chrome !== "undefined" &&
    chrome.runtime?.sendMessage
  ) {
    chrome.runtime.sendMessage("bihnnpbmbplmblhmidddpepecdgpclgg", {
      type: "SUPABASE_LOGOUT",
      origin: window.location.origin,
    });
  }
};
