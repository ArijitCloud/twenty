import { useEffect, useState } from 'react';
import styled from '@emotion/styled';

import { FieldRecoilScopeContext } from '@/ui/data/inline-cell/states/recoil-scope-contexts/FieldRecoilScopeContext';
import { RecoilScope } from '@/ui/utilities/recoil-scope/components/RecoilScope';
import { Company, useUpdateOneCompanyMutation } from '~/generated/graphql';

type CompanyNameEditableFieldProps = {
  company: Pick<Company, 'id' | 'name'>;
};

const StyledEditableTitleInput = styled.input<{
  value: string;
}>`
  background: transparent;

  border: none;
  color: ${({ theme, value }) =>
    value ? theme.font.color.primary : theme.font.color.light};
  display: flex;
  flex-direction: column;

  font-size: ${({ theme }) => theme.font.size.xl};
  font-weight: ${({ theme }) => theme.font.weight.semiBold};
  justify-content: center;

  line-height: ${({ theme }) => theme.text.lineHeight.md};
  outline: none;
  &::placeholder {
    color: ${({ theme }) => theme.font.color.light};
  }
  text-align: center;
  width: calc(100% - ${({ theme }) => theme.spacing(2)});
`;

export const CompanyNameEditableField = ({
  company,
}: CompanyNameEditableFieldProps) => {
  const [internalValue, setInternalValue] = useState(company.name);

  const [updateCompany] = useUpdateOneCompanyMutation();

  useEffect(() => {
    setInternalValue(company.name);
  }, [company.name]);

  const handleChange = async (newValue: string) => {
    setInternalValue(newValue);
  };

  const handleSubmit = async () => {
    await updateCompany({
      variables: {
        where: {
          id: company.id,
        },
        data: {
          name: internalValue ?? '',
        },
      },
    });
  };

  return (
    <RecoilScope CustomRecoilScopeContext={FieldRecoilScopeContext}>
      <StyledEditableTitleInput
        autoComplete="off"
        onChange={(event) => handleChange(event.target.value)}
        onBlur={handleSubmit}
        value={internalValue}
      />
    </RecoilScope>
  );
};
