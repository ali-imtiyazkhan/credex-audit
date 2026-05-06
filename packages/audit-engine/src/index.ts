export const audit = async (data: any) => {
  console.log('Auditing data:', data);
  return {
    score: 100,
    status: 'passed',
  };
};
