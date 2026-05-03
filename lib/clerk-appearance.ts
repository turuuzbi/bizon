export const clerkAppearance = {
  variables: {
    colorPrimary: "#8e55cf",
    colorBackground: "#fffaf7",
    colorText: "#241d2c",
    colorInputBackground: "#ffffff",
    colorInputText: "#241d2c",
    colorTextSecondary: "#655b71",
    borderRadius: "18px",
  },
  elements: {
    rootBox: "w-full",
    card: "w-full border-0 bg-transparent shadow-none",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    socialButtonsBlockButton:
      "rounded-[18px] border border-[#e3d8ef] bg-white text-[#241d2c] shadow-none hover:bg-[#faf5ff]",
    socialButtonsBlockButtonText: "font-medium",
    dividerLine: "bg-[#e8deef]",
    dividerText: "text-[#7a6f87]",
    formFieldLabel: "font-medium text-[#5e5469]",
    formFieldInput:
      "rounded-[18px] border border-[#ddd2e8] bg-white text-[#241d2c] shadow-none focus:border-[#8e55cf] focus:ring-0",
    formButtonPrimary:
      "rounded-[18px] bg-[#8e55cf] text-white shadow-none hover:bg-[#7d45c1]",
    footerActionLink: "font-semibold text-[#8e55cf] hover:text-[#6d36ad]",
    identityPreviewText: "text-[#241d2c]",
    identityPreviewEditButton: "text-[#8e55cf] hover:text-[#6d36ad]",
    formResendCodeLink: "text-[#8e55cf] hover:text-[#6d36ad]",
    alertText: "text-[#8a3e52]",
  },
} as const;
