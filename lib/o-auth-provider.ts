import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { ComponentProps, ElementType } from "react";

export const SUPPORTED_OAUTH_PROVIDERS = ["google", "github"] as const;
export type SupportedOAuthProviders =
  (typeof SUPPORTED_OAUTH_PROVIDERS)[number];

export const SUPPORTED_OAUTH_PROVIDERS_DETAILS: Record<
  SupportedOAuthProviders,
  {
    name: string;
    Icon: ElementType<ComponentProps<"svg">>;
  }
> = {
  google: {
    name: "Google",
    Icon: IconBrandGoogle,
  },
  github: {
    name: "GitHub",
    Icon: IconBrandGithub,
  },
};
