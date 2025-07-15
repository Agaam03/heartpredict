import ResultPage from "./ResultPage";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <ResultPage id={id} />;
};

export default Page;
