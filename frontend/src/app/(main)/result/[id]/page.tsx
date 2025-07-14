import ResultPage from "./ResultPage";

const Page = async ({ params }: { params: { id: string } }) => {
  return <ResultPage id={params.id} />;
};

export default Page;
