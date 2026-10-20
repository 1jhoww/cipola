export const environments = [
  {
    id: "cozinha",
    name: "Cozinha",
    description: "Ilha e bancada em diálogo com a madeira.",
  },
  {
    id: "banheiro",
    name: "Banheiro",
    description: "Luz suave e uma bancada de linhas contínuas.",
  },
  {
    id: "gourmet",
    name: "Área gourmet",
    description: "A pedra como ponto de encontro.",
  },
  {
    id: "lavabo",
    name: "Lavabo",
    description: "Uma peça esculpida, vista de perto.",
  },
] as const;
export type EnvironmentId = (typeof environments)[number]["id"];
export type EnvironmentImage = {
  environment: EnvironmentId;
  src: string;
  alt: string;
  width: number;
  height: number;
  simulation: true;
};
