import styled from "@emotion/styled";
import { getContract, getValue } from "./marketplaceHelpers";
import { useEffect, useState } from "react";

const ImageWrapper = styled.div`
  background-color: black;

  @media only screen and (max-width: 600px) {
    position: relative;
  }
`;

const TokenImage = styled.img`
  padding: var(--sp2);
  width: 400px;

  @media only screen and (max-width: 600px) {
    max-width: 250px;
  }

  transition: all 250ms;
`;

const TokenIFrame = styled.iframe`
  padding: var(--sp2);
  width: 400px;
  height: 400px;

  position: relative;
  z-index: 100;
  border: none;

  @media only screen and (max-width: 600px) {
    max-width: 250px;
    max-height: 250px;
  }
`;

const IFrameFallBack = styled.img`
  padding: var(--sp2);
  position: absolute;
  top: 0;
  left: 0;

  z-index: 2;

  width: 400px;
  height: 400px;

  @media only screen and (max-width: 600px) {
    max-width: 250px;
    max-height: 250px;
  }
`;

const TraitImage = styled(TokenImage)`
  position: absolute;
  top: 0;
  left: 0;

  opacity: 0;
`;

const NewFrame = styled.div`
  --frameSize: 36px;
  width: calc(100% + 0.85 * var(--frameSize));
  height: calc(100% - 15px);

  position: absolute;
  left: calc(-0.425 * var(--frameSize));
  top: calc(-0.1 * var(--frameSize));
  z-index: 1;
  border-image-source: url(/static/img/newframe_black.png);
  border-image-slice: 35 50;
  border-image-width: var(--frameSize);
  border-style: solid;
  border-image-repeat: round;
  image-rendering: pixelated;

  @media only screen and (max-width: 600px) {
    width: 111%;
    height: 102%;
  }
`;

export default function ImageWithTraits({
  source,
  background,
  traitHover,
  contract,
  attributes,
  keyImage,
  iFrame,
  tokenId,
}:{
  source: string;
  background: string;
  traitHover: string;
  contract: string;
  attributes: any;
  keyImage: number;
  iFrame: boolean;
  tokenId: string;
}) {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth <= 600
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 600);
    }

    if (typeof window !== 'undefined') {
      handleResize();
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  let contractDict = getContract(contract);
  if (isMobile || !iFrame) {
    return (
      <ImageWrapper>
        <TokenImage 
          src={source} 
          style={{background: background, opacity: traitHover && keyImage == 0 ? 0.25 : 1}}
        />
        <NewFrame/>
        {contractDict.coreTraits?.map((trait: any, index: number) => {
            return (
              getValue(attributes, trait) != 'None' &&
              <TraitImage 
                src={`/static/img/traits/${contractDict.display.toLowerCase()}/${trait.toLowerCase()}/${getValue(attributes, trait)}.png`}
                style={{
                  opacity: (traitHover == trait) ? 1 : (trait == 'Head' && traitHover == 'Body') ? .25 : 0,
                  zIndex: trait == 'Body' ? 0 : 1,
                  display: keyImage == 0 ? 'block' : 'none',
                  top: contractDict.display == 'Warriors' ? '-0.5px' : '0',
                  left: contractDict.display == 'Warriors' ? '-0.5px' : '0',
                }}
                key={index}
              />
            );
          })}
      </ImageWrapper>
    )
  } else {
    return (
      <ImageWrapper>
        <TokenIFrame 
          src={`https://www.forgottenrunes.com/viewer/wizards/${tokenId}`}
          style={{display: loaded ? 'block' : 'none'}}
          onLoad={() => setLoaded(true)}
        />
        <NewFrame style={{background: background}}/>
        <IFrameFallBack src={source}/>
      </ImageWrapper>
    )
  }
}
