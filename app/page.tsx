import { gql } from "graphql-request";
import Image from "next/image";

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

async function getData() {}

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      hello
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.name}>
            <Image
              src={recipe.asset}
              alt={recipe.name}
              width={200}
              height={200}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
