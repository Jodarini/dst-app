import { gql } from "graphql-request";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface Root {
  data: Data;
}

export interface Data {
  crockpotRecipes: CrockpotRecipe[];
}

export interface CrockpotRecipe {
  asset: string;
  cookingTime: string;
  isWarlySpecial: boolean;
  name: string;
  sideEffect: string;
  spoils: string;
  stats: Stats;
  type: string;
}

export interface Stats {
  health: number;
  hunger: number;
  sanity: number;
}

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
  const { data }: { data: Data } = await fetch(
    "https://dont-starve-together-api.xyz/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_RECIPES,
      }),
      next: { revalidate: 10 },
    }
  ).then((res) => res.json());

  let recipes = data.crockpotRecipes;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-2 bg-orange-900">
      <article>
        <ul className="grid gap-4 grid-cols-4 mx-auto">
          {recipes.map((recipe: CrockpotRecipe) => (
            <li key={recipe.name} className="col-span-1 flex flex-col">
              <Card className="bg-orange-200 flex flex-col justify-around">
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
                  <div className="flex flex-row justify-between place-items-stretch">
                    <span className="flex flex-row">
                      <Image
                        src="https://static.wikia.nocookie.net/dont-starve-game/images/f/f3/HealthMeter.png/revision/latest?cb=20130410165108"
                        width={25}
                        height={25}
                        alt="Hunger"
                      />
                      {recipe.stats.health}
                    </span>
                    <span className="flex flex-row">
                      <Image
                        src="https://static.wikia.nocookie.net/dont-starve-game/images/4/48/Hunger_Meter.png/revision/latest?cb=20190617114410"
                        width={25}
                        height={25}
                        alt="Hunger"
                      />
                      {recipe.stats.hunger}
                    </span>
                    <span className="flex flex-row">
                      <Image
                        src="https://static.wikia.nocookie.net/dont-starve-game/images/2/2f/Sanity_Meter.png/revision/latest?cb=20190617114749"
                        width={25}
                        height={25}
                        alt="Sanity"
                      />
                      {recipe.stats.sanity}
                    </span>
                  </div>
                  <p>
                    <strong>Cooking time: </strong>
                    {recipe.cookingTime}
                  </p>
                  <p>
                    <strong>Side effect: </strong>
                    {recipe.sideEffect}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
