import { ResponsivePie } from '@nivo/pie'

const MyResponsivePie = ({ data }) => {
  // const data = [
  //   {
  //     "id": "java",
  //     "label": "java",
  //     "value": 564,
  //   },
  //   {
  //     "id": "rust",
  //     "label": "rust",
  //     "value": 492,
  //   },
  // ];

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 20, right: 80, bottom: 40, left: 80 }}
      borderColor={{
        from: 'color'
      }}
      arcLabel={d => `${d.id} (${d.value})`}
      enableArcLinkLabels={false}
      colors={{ scheme: 'set2' }}
      legends={[]}
    />
  )
}

export default MyResponsivePie;