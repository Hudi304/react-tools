export function testURLSearchParamsToStringWithNullValue() {
  const queryParams = {
    dsa: undefined,
    p: 'dsadas',
    t: 'dsadas',
  };

  const q_para = queryParams as any;
  const params = new URLSearchParams();
  Object.keys(queryParams).forEach((key) => q_para[key] && params.set(key, q_para[key]));

  console.log(`|${params.toString()}|`);
}
