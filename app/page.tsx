import { gql } from "graphql-request";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const GET_RECIPES = gql`
  query allRecipes {
    crockpotRecipes {
      asset
      cookingTime
      isWarlySpecial
      name
      sideEffect
      spoils
      stats {
        health
        hunger
        sanity
      }
      type
    }
  }
`;

export default async function Home() {
  const { data } = await fetch("https://dont-starve-together-api.xyz/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GET_RECIPES,
    }),
    next: { revalidate: 10 },
  }).then((res) => res.json());

  let recipes = data.crockpotRecipes;

  console.log({ recipes });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-800">
      <article>
        <ul className="grid grid-cols-4">
          {recipes.map((recipe) => (
            <li key={recipe.name} className="max-h-[204px]">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>{recipe.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Image
                    className="m-auto"
                    src={recipe.asset}
                    alt={recipe.name}
                    width={50}
                    height={50}
                  />
                  <p>{recipe.cookingTime}</p>
                </CardContent>
                <CardFooter>{recipe.sideEffect}</CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
