import assert from "power-assert";
import React from "react";
import { render, shallow } from "enzyme";
import toJson from "enzyme-to-json";
import CityPicker from "../index";
import Input from "../../input";
import CityPickerCore from "../CityPickerCore";
import Spin from "../../spin";

const cityList = [
  {
    group: "热门",
    resources: [
      {
        id: 1,
        name: "成都"
      }
    ]
  },
  {
    group: "ABCDE",
    resources: [
      {
        id: 1,
        name: "成都"
      },
      {
        id: 2,
        name: "资阳"
      }
    ]
  },
  {
    group: "FGHIJ",
    resources: [
      {
        id: 3,
        name: "上海"
      },
      {
        id: 4,
        name: "乐至"
      }
    ]
  },
  {
    group: "KLMNO",
    resources: [
      {
        id: 5,
        name: "自贡"
      },
      {
        id: 6,
        name: "北京"
      },
      {
        id: 7,
        name: "香港"
      },
      {
        id: 8,
        name: "南京"
      },
      {
        id: 9,
        name: "简阳"
      }
    ]
  },
  {
    group: "PQRST",
    resources: [
      {
        id: 10,
        name: "广州"
      }
    ]
  },
  {
    group: "UVWXYZ",
    resources: [
      {
        id: 11,
        name: "西安"
      }
    ]
  }
];

describe("<CityPicker/>", () => {
  it("should render CityPicker", () => {
    const wrapper = render(<CityPicker cityList={cityList} />);
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it("should render Input when render CityPicker", () => {
    const wrapper = shallow(<CityPicker cityList={cityList} />);
    assert(wrapper.find(Input).length === 1);
  });

  it("should render CityPickerCore when render CityPicker", () => {
    const wrapper = shallow(<CityPicker cityList={cityList} />);
    assert(wrapper.find(CityPickerCore).length === 1);
  });

  it("should render cuke-city-picker classnames", () => {
    const wrapper = shallow(<CityPicker cityList={cityList} />);
    assert(wrapper.find(".cuke-city-picker").length === 1);
  });

  it("should render cuke-city-picker-core classnames", () => {
    const wrapper = shallow(<CityPickerCore cityList={cityList} />);
    assert(wrapper.find(".cuke-city-picker-core").length === 1);
  });
  it("should render CityPickerCore ", () => {
    const wrapper = shallow(<CityPicker cityList={cityList} />);
    assert(wrapper.find(CityPickerCore).length === 1);
  });

  it("should render custom number active city group", () => {
    const wrapper = shallow(
      <CityPicker cityList={cityList} defaultActiveGroup={2} />
    );
    assert(wrapper.state().selectedCityGroup === 2);
  });

  it("should render custom string active city group ", () => {
    const wrapper = shallow(
      <CityPicker cityList={cityList} defaultActiveGroup={"热门"} />
    );
    assert(wrapper.state().selectedCityGroup === "热门");
  });

  it("should render custom disabled city group and can not trigger click event ", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <CityPicker
        onCityGroupChange={onChange}
        cityList={cityList}
        disabledGroups={[0, 1, 2, 3, 4, 5, 6]}
      />
    );
    wrapper.find(".cuke-city-picker").simulate("click");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("should can trigger city group change event ", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <CityPicker onCityGroupChange={onChange} cityList={cityList} />
    );
    setTimeout(() => {
      wrapper.find(".cuke-city-picker-core-item").simulate("click");
      expect(onChange).toHaveBeenCalled();
    });
  });

  it("should can trigger city group change event ", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <CityPicker onCityChange={onChange} cityList={cityList} />
    );
    setTimeout(() => {
      wrapper.find(".cuke-city-picker-core-city").simulate("click");
      expect(onChange).toHaveBeenCalled();
    });
  });

  it("should can trigger city group change event in CityPickerCore ", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <CityPickerCore onCityChange={onChange} cityList={cityList} />
    );
    wrapper.find(".cuke-city-picker-core-city").simulate("click");
    expect(onChange).toHaveBeenCalled();
  });

  it("should can trigger city group change event in CityPickerCore ", () => {
    const onChange = jest.fn();
    const wrapper = shallow(
      <CityPickerCore onCityGroupChange={onChange} cityList={cityList} />
    );
    wrapper
      .find(".cuke-city-picker-core-item")
      .at(0)
      .simulate("click");
    expect(onChange).toHaveBeenCalled();
  });

  it("should window cannot trigger click event when un mount", () => {
    const onClick = jest.fn();
    const wrapper = shallow(<CityPicker cityList={cityList} />);
    wrapper.unmount();
    window.onclick = () => onClick;
    expect(onClick).not.toHaveBeenCalled();
  });

  it("should trigger panel visible change", () => {
    const onPanelVisibleChange = jest.fn();
    const wrapper = shallow(
      <CityPicker
        cityList={cityList}
        onPanelVisibleChange={onPanelVisibleChange}
      />
    );
    wrapper.find(".cuke-city-picker-input").simulate("click");
    expect(onPanelVisibleChange).toHaveBeenCalled();
  });

  it("should trigger onCityChange by CityPickerCore", () => {
    const onCityChange = jest.fn();
    const wrapper = shallow(
      <CityPickerCore cityList={cityList} onCityChange={onCityChange} />
    );
    wrapper
      .find(".cuke-city-picker-core-city")
      .at(0)
      .simulate("click");
    expect(onCityChange).toHaveBeenCalled();
  });

  it("should render spin when loading is true", () => {
    const wrapper = shallow(
      <CityPickerCore cityList={cityList} loading={true} />
    );
    assert(wrapper.find(Spin).length === 1);
  });

  it("should render spin when loading is true", () => {
    const wrapper = shallow(<CityPicker cityList={cityList} loading={true} />);
    assert(wrapper.find(Spin).length === 0);
  });

  it("should trigger onCityGroupChange by CityPickerCore", () => {
    const onCityGroupChange = jest.fn();
    const wrapper = shallow(
      <CityPickerCore
        cityList={cityList}
        onCityGroupChange={onCityGroupChange}
      />
    );
    wrapper
      .find(".cuke-city-picker-core-item")
      .at(0)
      .simulate("click");
    expect(onCityGroupChange).toHaveBeenCalled();
  });

  it("should cannot trigger panel visible change when disabled groups", () => {
    const onPanelVisibleChange = jest.fn();
    const wrapper = shallow(
      <CityPicker
        cityList={cityList}
        disabled
        onPanelVisibleChange={onPanelVisibleChange}
      />
    );
    wrapper.find(".cuke-city-picker").simulate("click");
    expect(onPanelVisibleChange).not.toHaveBeenCalled();
  });

  // it("should cannot trigger panel visible change when disabled groups", () => {
  //   const onPanelVisibleChange = jest.fn();
  //   const wrapper = mount(
  //     <CityPicker
  //       cityList={cityList}
  //       onPanelVisibleChange={onPanelVisibleChange}
  //     />
  //   );
  //   wrapper.setState({visible: true})
  //   wrapper.find(".cuke-city-picker-core-item").at(0).simulate("click");
  //   expect(onPanelVisibleChange).toHaveBeenCalled();
  // });
});
