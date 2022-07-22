export default function Home() {
  return <></>;
}

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};
