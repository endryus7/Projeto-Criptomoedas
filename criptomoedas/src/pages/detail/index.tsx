import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { type CoinProps } from "../home";

interface ResponseData {
  data: CoinProps;
}

interface ErrorData {
  error: string;
}

type DataProps = ResponseData | ErrorData;

export function Detail() {
  const { cripto } = useParams();
  const navigate = useNavigate();

  const [coin, setCoin] = useState<CoinProps>()

  useEffect(() => {
    async function getCoin() {
      try {
        fetch(
          `https://rest.coincap.io/v3/assets/${cripto}?limit=10&offset=0&apiKey=23b97e9019cc3bc1ce0202b7dfa025d144ba2e16dc91567d7d4ea5aed380a631`,
        )
          .then((response) => response.json())
          .then((data: DataProps) => {
            if ("error" in data) {
              navigate("/");
              return;
            }

            const price = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            });

            const priceCompact = Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              notation: "compact",
            });

            const resultData = {
              ...data.data,
              formatedPrice: price.format(Number(data.data.priceUsd)),
              formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
              formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
            };

            setCoin(resultData)

          });
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    }

    getCoin();
  }, [cripto]);

  return (
    <div>
      <h1>Detail {cripto}</h1>
    </div>
  );
}
